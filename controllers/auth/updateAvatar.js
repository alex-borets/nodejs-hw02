const fs = require('fs/promises');
const path = require('path');
const jimp = require('jimp');
const { User } = require('../../models/user');

const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars');

const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    console.log(req.user);

    const extention = originalname.split('.').pop();
    const filename = `${_id}.${extention}`;

    const resultUpload = path.join(avatarsDir, filename);

    await fs.rename(tempUpload, resultUpload);

    const avatarImage = await jimp.read(resultUpload);
    avatarImage.resize(250, 250).write(resultUpload);

    const avatarURL = path.join('avatars', filename);

    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(req.file.path);
    throw error;
  }
};

module.exports = updateAvatar;
