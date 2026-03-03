import fs from 'fs';
import path from 'path';

export const getAllMedia = (req: any, res: any) => {
    const directoryPath = path.join(__dirname, '../../uploads');
    fs.readdir(directoryPath, (err, files) => {
        if (err) return res.status(500).send("Unable to scan files");
        const fileInfos = files.map(file => ({ name: file, url: `/uploads/${file}` }));
        res.status(200).json({ success: true, data: fileInfos });
    });
};
