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

    static dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }
}