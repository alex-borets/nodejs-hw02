const fs = require('fs/promises');
const path = require('path');
const jimp = require('jimp');
const { User } = require('../../models/user');

const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars');

const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.files;

    const extension = originalname.split('.').pop();
    const filename = `${_id}.${extension}`;

    const resultUpload = path.join(avatarsDir, filename);

    await fs.rename(tempUpload, resultUpload);

    const avatarImage = await jimp.read(resultUpload);
    await avatarImage.resize(250, 250).writeAsync(resultUpload);

    const avatarsURL = path.join('avatars', filename);

    await User.findByIdAndUpdate(_id, { avatarsURL });
    res.json({
      avatarsURL,
    });
  } catch (error) {
    await fs.unlink(req.file.path);
    throw error;
  }
};

module.exports = updateAvatar;
