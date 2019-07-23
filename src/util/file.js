export default class FileUtils {
    
    static canAccept(file) {
        let formatosValidos = [
            "video/mp4",
            "image/jpeg",
            "image/png",
            "image/gif"
        ];

        return formatosValidos.includes(file.type);
    }

    static getTipo(file) {
        if(file.type === "video/mp4")
            return process.env.VUE_APP_SIMBOLO_VIDEO;
        else if (this.canAccept(file))
            return process.env.VUE_APP_SIMBOLO_IMAGEM;

        return null;
    }

    static toMB(sizeB) {
        return (sizeB /1024) / 1024;
    }
}