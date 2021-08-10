import { MenuItem } from "src/app/_interfaces/menu.interface";



export const MenuNavigation: MenuItem[] = [

    {
        id: 'main.inicio-app',
        title: 'Inicio',
        icon: 'home',
        link: '/main/inicio-app'
    },
    {
        id: 'main.avanzado',
        title: 'Avanzado',
        icon: 'settings',
        link: '/main/avanzado'
    },
];
export const ServiceMenuNavigation: MenuItem[] = [
    {
        id: 'auth',
        title: 'Autenticación digital',
        description: 'Lorem ipsum, lorem ipsum,lorem ipsum, lorem ipsum.Lorem ipsum, lorem ipsum,lorem ipsum, lorem ipsum.',
        image: 'assets/imagenes/IDGOBPEVERDE.png',
        icon: 'lock_open',
        link: '/main/autenticacion-digital'
    },
    {
        id: 'sign_digital',
        title: 'Firma digital',
        description: 'Lorem ipsum, lorem ipsum,lorem ipsum, lorem ipsum.Lorem ipsum, lorem ipsum,lorem ipsum, lorem ipsum.',
        image: 'assets/imagenes/ico_firmadigital.png',
        icon: 'create',
        link: '/main/firma-digital'
    },
    {
        id: 'sign_validation',
        title: 'Validación de firma',
        description: 'Lorem ipsum, lorem ipsum,lorem ipsum, lorem ipsum.Lorem ipsum, lorem ipsum,lorem ipsum, lorem ipsum.',
        image: 'assets/imagenes/ico_validacion_firma_digital.png',
        icon: 'done_all',
        link: '/main/validacion-firma'
    },
    {
        id: 'sign_agent',
        title: 'Agente automatizado',
        description: 'Lorem ipsum, lorem ipsum,lorem ipsum, lorem ipsum.Lorem ipsum, lorem ipsum,lorem ipsum, lorem ipsum.',
        image: 'assets/imagenes/robot-solid.png',
        icon: 'smart_toy',
        link: '/main/agente-automatizado'
    },
];