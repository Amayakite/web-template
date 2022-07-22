import { resourceService } from '@/util/request';

export default class FileUtils {
    /**
     * 将一个文件转换成base64
     * @param file 文件对象
     * @returns  base64字符串
     */
    static async GetBase64Image(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }
    /**
     * 通过http请求获取base64文件
     * @param url 文件地址
     * @returns base64字符串
     */
    static async GetHttpImageToBase64(url: string): Promise<string> {
        try {
            const res: ArrayBuffer = await resourceService.get(url, {
                headers: {
                    'Content-Type':
                        'text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    Accept: 'image/*'
                },
                responseType: 'arraybuffer'
            });
            const base64 = Buffer.from(res).toString('base64');
            return base64;
        } catch (error) {
            console.log(error);
            try {
                const res = await resourceService.get(url, {
                    headers: {
                        'Content-Type':
                            'text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        Accept: 'image/*'
                    },
                    responseType: 'blob'
                });
                console.log('two res:', res);
                const base64 = await FileUtils.GetBase64Image(res.data);
                return base64;
            } catch (error) {
                throw error;
            }
        }
    }

    /**
     * 将base64转换成文件
     * @param base64  base64字符串
     * @param fileName  文件名
     * @returns  文件对象
     */
    static async Base64ToFile(base64: string, fileName: string): Promise<File> {
        const arr = base64.split(',');
        // @ts-ignore
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: mime });
    }
    /**
     *  获取图片的宽高
     * @param userFile  文件对象
     */
    static GetImageWH(
        userFile: File
    ): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            // 先判断是否是图片
            if (!userFile.type.startsWith('image')) {
                reject('应该传入图片');
            }
            const reader = new FileReader();
            reader.readAsDataURL(userFile);
            reader.onload = () => {
                // 创建canvas
                // const canvas = document.createElement('canvas');
                // const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    // canvas.width = img.width;
                    // canvas.height = img.height;
                    // ctx!.drawImage(img, 0, 0);
                    // console.log(canvas.width, canvas.height);

                    // 等比放大图片
                    // const maxWidth = 300;
                    // const maxHeight = 300;
                    // const width = img.width;
                    // const height = img.height;
                    // const rate = width / height;
                    // let newWidth = width;
                    // let newHeight = height;
                    // if (width > maxWidth) {
                    //     newWidth = maxWidth;
                    //     newHeight = maxWidth / rate;
                    // }
                    // if (height > maxHeight) {
                    //     newHeight = maxHeight;
                    //     newWidth = maxHeight * rate;
                    // }
                    // img.width = newWidth;
                    // img.height = newHeight;
                    resolve({
                        width: img.width,
                        height: img.height
                    });
                };
            };
        });
    }

    // TODO 压缩图片等功能
}
