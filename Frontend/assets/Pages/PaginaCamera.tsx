// assets/Pages/PaginaCamera.tsx
import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { File } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

import { useAuth } from '../Contexts/AuthContext';
import { parseReceita } from '../utils/parserReceita';

const API_URL = 'https://ideal-creation-production-a192.up.railway.app';

export default function PaginaCamera({ navigation }: any) {
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [processando, setProcessando] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { token } = useAuth();

  // ---------------------------------------------------------- permissão
  if (!permissao) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!permissao.granted) {
    return (
      <View style={styles.centro}>
        <Text style={styles.textoPermissao}>
          Precisamos da câmera para escanear a receita ou a caixa do remédio.
        </Text>
        <TouchableOpacity style={styles.botaoPermissao} onPress={pedirPermissao}>
          <Text style={styles.textoBotaoPermissao}>Permitir câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.textoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ------------------------------------------------------------ captura
  async function tirarFoto() {
    if (!cameraRef.current || processando) return;

    try {
      setProcessando(true);

      const foto = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });

      if (!foto?.uri) throw new Error('Não consegui capturar a imagem.');

      // a foto crua da câmera facilmente passa de 5MB — redimensiona a largura
      // e recomprime em JPEG pra ficar bem abaixo do limite do backend
      const manipulada = await ImageManipulator.manipulateAsync(
        foto.uri,
        [{ resize: { width: 1600 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      const form = new FormData();
      const arquivo = new File(manipulada.uri);
      form.append('foto', arquivo, 'receita.jpg');

      // não defina Content-Type na mão: o fetch monta o boundary do multipart sozinho
      const resposta = await fetch(`${API_URL}/ocr`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });

      const json = await resposta.json().catch(() => null);

      if (!resposta.ok || json?.sucesso === false) {
        throw new Error(json?.message ?? `O servidor respondeu ${resposta.status}.`);
      }

      // o controller responde { sucesso: true, data: resultado }
      const dados1 = json?.data ?? json;
      const texto: string =
        (typeof dados1 === 'string' ? dados1 : dados1?.texto ?? dados1?.text) ?? '';

      if (!texto.trim()) {
        throw new Error('Não consegui ler nenhum texto na imagem.');
      }

      const dados = parseReceita(texto);

      // volta pra principal já mandando os dados; a PaginaPrincipal abre o modal
      navigation.navigate('PaginaPrincipal', { dadosEscaneados: dados });
    } catch (erro: any) {
      Alert.alert(
        'Não deu certo',
        `${erro?.message ?? 'Erro inesperado.'}\n\nTente aproximar a câmera, evitar sombra e manter o papel reto.`,
        [
          { text: 'Tentar de novo', style: 'cancel' },
          { text: 'Preencher na mão', onPress: () => navigation.navigate('PaginaPrincipal', { abrirModalVazio: true }) },
        ]
      );
    } finally {
      setProcessando(false);
    }
  }

  // -------------------------------------------------------------- tela
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      {/* moldura de enquadramento */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.moldura} />
        <Text style={styles.dica}>
          Enquadre a receita ou o rótulo da caixa dentro da área
        </Text>
      </View>

      <View style={styles.barraInferior}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={processando}>
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.obturador, processando && styles.obturadorDesativado]}
          onPress={tirarFoto}
          disabled={processando}
        >
          {processando ? <ActivityIndicator color="#000" /> : <View style={styles.obturadorInterno} />}
        </TouchableOpacity>

        {/* espaçador pra manter o obturador centralizado */}
        <View style={{ width: 70 }} />
      </View>

      {processando && (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.textoCarregando}>Lendo a receita...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centro: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  textoPermissao: { color: '#fff', textAlign: 'center', fontSize: 16 },
  botaoPermissao: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  textoBotaoPermissao: { fontWeight: 'bold', color: '#000' },
  textoVoltar: { color: '#aaa', marginTop: 8 },

  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  moldura: {
    width: '85%',
    height: '45%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
  },
  dica: {
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  barraInferior: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  textoCancelar: { color: '#fff', fontSize: 16, width: 70 },
  obturador: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  obturadorDesativado: { opacity: 0.6 },
  obturadorInterno: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#000',
  },

  carregando: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  textoCarregando: { color: '#fff', fontSize: 16 },
});
