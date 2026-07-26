const User = require('../models/User');
const Setting = require('../models/Setting');

const ADMIN_PHONE = '+918484859316';
const ADMIN_PHONE_DISPLAY = '+91 84848 59316';

const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@dhanishtravel.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        name: 'Dhanish Admin',
        email: adminEmail,
        password: 'adminpassword123',
        phone: ADMIN_PHONE,
        role: 'admin',
      });
      console.log('✅ Default Admin Account Created: admin@dhanishtravel.com / adminpassword123');
    } else {
      if (adminExists.phone !== ADMIN_PHONE) {
        adminExists.phone = ADMIN_PHONE;
        await adminExists.save();
        console.log(`✅ Admin phone updated to ${ADMIN_PHONE_DISPLAY}`);
      } else {
        console.log('ℹ️ Admin Account Verified: admin@dhanishtravel.com');
      }
    }

    let settings = await Setting.findOne();
    if (!settings) {
      await Setting.create({
        phone: ADMIN_PHONE_DISPLAY,
        socialLinks: { whatsapp: ADMIN_PHONE },
      });
    } else if (settings.phone !== ADMIN_PHONE_DISPLAY || settings.socialLinks?.whatsapp !== ADMIN_PHONE) {
      settings.phone = ADMIN_PHONE_DISPLAY;
      settings.socialLinks = {
        ...settings.socialLinks,
        whatsapp: ADMIN_PHONE,
      };
      await settings.save();
      console.log(`✅ Site contact phone updated to ${ADMIN_PHONE_DISPLAY}`);
    }
  } catch (error) {
    console.error('Failed to ensure default admin account:', error.message);
  }
};

module.exports = createDefaultAdmin;
