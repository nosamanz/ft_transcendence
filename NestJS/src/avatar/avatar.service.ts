import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AvatarService {

	async changeAvatar(file: any, userID: number)
	{
        const directoryPath = './Avatars/';
        if(file === undefined)
        {
            let res: string;
            fs.copyFile("./default.jpeg", `${directoryPath}${userID}.jpeg`, (err) => {
                if (err) {
                    res = 'Error copying the image';
                } else {
                    res = 'Default.jpeg saved as image successfully.';
                }
            });
            return res;
        }
		const ext = file.substring(file.indexOf('/') + 1, file.indexOf(';'));
        const AvatarFileName = userID + '.' + ext;
        const base64Image = file.split(';base64,').pop();

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        //Hint: !! delete thwe old one          
        await this.deleteTheOldestWriteNew(directoryPath, userID.toString(), AvatarFileName, base64Image);
        console.log(`${directoryPath}${AvatarFileName}`);
        return "File uploadad successfully!";
	}

    async deleteTheOldestWriteNew(directoryPath: string, id: string, AvatarFileName: string, base64Image: any){
        fs.readdir(directoryPath, async (error, files) => {
            if (error) {
              console.error(`Error reading directory.`);
              return;
            }
        
            files.forEach(async (file) => {
                if (file.split('.')[0] === id)
                {
                    await fs.unlinkSync(directoryPath + "/" + file);
                }
            });
            try { await fs.writeFileSync(`${directoryPath}${AvatarFileName}`, base64Image, { encoding: 'base64' });}
            catch(error) { return "Write error!" }
        });
    }
}
