declare module '*.scss';
declare module "*.module.css";

// Feather icons
interface Window {
    feather?: {
        replace(): void;
    };
}