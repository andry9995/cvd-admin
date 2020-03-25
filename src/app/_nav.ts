import { INavData } from '@coreui/angular';

export const navItems: INavData[] =[{
    name: 'Tableau de bord',
    url: '/dashboard',
    icon: 'icon-speedometer',
  },
  {
  	name: 'Equipements',
    url: '/medical',
    icon: 'fa fa-medkit',
    children: [
      {
        name: 'Catégorie',
        url: '/categorie',
        icon: 'fa fa-plus-square'
      },
      // {
      //   name: 'Liste',
      //   url: '/medical',
      //   icon: 'fa fa-stethoscope'
      // },
    ]
  },
]
