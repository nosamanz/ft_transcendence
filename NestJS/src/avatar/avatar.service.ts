import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AvatarService {

	async changeAvatar(file, userID)
	{
		const ext = file.substring(file.indexOf('/') + 1, file.indexOf(';'));
        const AvatarFileName = userID + '.' + ext;
        const base64Image = file.split(';base64,').pop();
        const directoryPath = './Avatars/';

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        //Hint: !! delete thwe old one          
        this.deleteTheOldestOne(directoryPath, userID.toString());
        await fs.writeFile(`${directoryPath}/${AvatarFileName}`, base64Image, { encoding: 'base64' }, (err) => {
            if (err) {
                return 'Error writing file:' + err;
            }
        });
        return "File uploadad successfully!";
	}
    async deleteTheOldestOne(directoryPath: string, id: string){
        fs.readdir(directoryPath, (error, files) => {
            if (error) {
              console.error(`Error reading directory.`);
              return;
            }
        
            files.forEach((file) => {
                if (file.split('.')[0] === id)
                {
                    fs.unlinkSync(directoryPath + "/" + file);
                }
            });
        });
    }
}
