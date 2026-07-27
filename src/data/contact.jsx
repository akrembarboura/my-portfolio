import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';

// Contact info — links and details shown in the contact section
const contactInfo = [
  {
    id: 1,
    icon: <FaEnvelope className="w-6 h-6" />, // You can add Tailwind classes directly to the icons!
    iconClass: 'mail',
    label: 'Email',
    value: 'akrembarboura@gmail.com',
    href: 'mailto:akrembarboura@gmail.com',
  },
  {
    id: 2,
    icon: <FaGithub className="w-6 h-6" />,
    iconClass: 'github',
    label: 'GitHub',
    value: 'github.com/akrembarboura',
    href: 'https://github.com/akrembarboura',
  },
  {
    id: 3,
    icon: <FaLinkedin className="w-6 h-6" />,
    iconClass: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/akrembarboura',
    href: 'https://linkedin.com/in/akrembarboura',
  },
  {
    id: 4,
    icon: <FaMapMarkerAlt className="w-6 h-6" />,
    iconClass: 'location',
    label: 'Location',
    value: 'Tunisia 🇹🇳 · Open to Remote',
    href: null,
  },
];

export default contactInfo;