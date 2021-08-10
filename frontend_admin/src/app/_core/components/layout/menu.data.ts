
export interface MenuItem {
    id: string;
    title: string;
    icon: string;
    link: string;
}


export const MenuNavigation: MenuItem[] = [

    {
        id: 'admin.institutions',
        title: 'Instituciones',
        icon: 'home',
        link: '/admin/institutions'
    },
    {
        id: 'admin.services',
        title: 'Servicios',
        icon: 'cloud',
        link: '/admin/services'
    },
    {
        id: 'institution.datos_generales',
        title: 'Datos generales',
        icon: 'text_snippet',
        link: '/institution/general'
    },
    {
        id: 'institution.apps',
        title: 'Apps',
        icon: 'settings',
        link: '/institution/apps'
    },
    {
        id: 'institution.desarrolladores',
        title: 'Desarrolladores',
        icon: 'people',
        link: '/institution/developer'
    }
];