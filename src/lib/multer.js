import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/media/")
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const types = /jpeg|jpg|png|gif/;
        const isValid = types.test(path.extname(file.originalname).toLowerCase());
        if (isValid) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"));
        }
    }
});

export default upload;