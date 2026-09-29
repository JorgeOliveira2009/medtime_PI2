import { OCR_SPACE_API_KEY } from "../config/env-config";
import { CustomError } from "../middlewares/errors-middlewares";

const OCR_SPACE_URL = "https://api.ocr.space/parse/image";

export const extrairTextoDaImagem = async (
    buffer: Buffer,
    mimetype: string
) => {
    if (!OCR_SPACE_API_KEY) {
        throw new CustomError("Serviço de OCR não configurado", 500);
    }

    const formData = new FormData();

    formData.append("apikey", OCR_SPACE_API_KEY);
    formData.append("language", "por");
    formData.append("isOverlayRequired", "false");
    formData.append("OCREngine", "2");

    // Converte o Buffer do Node para um formato aceito pelo Blob
    const bytes = new Uint8Array(buffer);

    formData.append(
        "file",
        new Blob([bytes], { type: mimetype }),
        "receita.jpg"
    );

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 15000);

    let resposta: globalThis.Response;

    try {
        resposta = await fetch(OCR_SPACE_URL, {
            method: "POST",
            body: formData,
            signal: controller.signal,
        });
    } catch {
        throw new CustomError(
            "Não foi possível conectar ao serviço de OCR",
            502
        );
    } finally {
        clearTimeout(timeoutId);
    }

    const json = await resposta.json() as any;

    if (json.IsErroredOnProcessing) {
        throw new CustomError(
            json.ErrorMessage?.[0] ?? "Erro ao processar a imagem",
            502
        );
    }

    const texto = json.ParsedResults?.[0]?.ParsedText ?? "";

    return { texto };
};