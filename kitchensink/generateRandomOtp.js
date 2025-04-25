export function generateOTP() {
    const digits = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
    let otp = '';
    
    // Add 6 random digits
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
  
    // Add 2 random uppercase letters
    for (let i = 0; i < 2; i++) {
      otp += letters[Math.floor(Math.random() * letters.length)];
    }
  
    // Shuffle the OTP to avoid fixed pattern
    return otp.split('').sort(() => Math.random() - 0.5).join('');
  }