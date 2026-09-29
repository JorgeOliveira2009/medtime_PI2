import multer from "multer";

// memoryStorage = guarda o arquivo em RAM (req.file.buffer), não salva em disco
// a imagem só passa por aqui a caminho do OCR.space, não precisa persistir
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});