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
        await fs.writeFile(`${directoryPath}/${AvatarFileName}`, base64Image, { encoding: 'base64' }, (err) => {
            if (err) {
                return 'Error writing file:' + err;
            }
        });
        return "File uploadad successfully!";
	}
}
