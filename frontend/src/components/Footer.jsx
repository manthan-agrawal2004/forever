import { assets } from '../assets/assets';

const Footer = () => {
    return (
        <div>
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
                <div>
                    <img src={assets.logo} className="mb-5 w-32" alt="Logo" />
                    <p className="w-full md:w-2/3 text-gray-600">
                        Elevate your style with ease—explore timeless fashion and modern trends at your fingertips. Follow us on social media for updates, exclusive deals, and style inspiration. Have questions? Our support team is here to help. Shop confidently with secure payments and hassle-free returns. Let&apos;s make fashion effortless and exciting together!
                    </p>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>+916206589414</li>
                        <li>agrawalmanthan276@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className="py-5 text-sm text-center">
                    Copyright 2024©forever.com - All Rights Reserved <br />
                    Unauthorized reproduction or distribution of any content, images, or designs is strictly prohibited.
                </p>
            </div>
        </div>
    );
};

export default Footer;