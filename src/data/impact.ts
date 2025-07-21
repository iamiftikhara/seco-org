// Combined Impact Data Structure
export const impactData = {
  id: '1',
  title: {
    en: { text: 'We Can Make A Difference' },
    ur: { text: 'ہم فرق لا سکتے ہیں' }
  },
  backgroundImage: '/images/impact-bg.jpg',
  showOnHomepage: true,
  stats: [
    {
      id: '1',
      value: '32',
      label: {
        en: { text: 'Districts' },
        ur: { text: 'اضلاع' }
      },
      suffix: '',
      iconName: 'FaMapMarked',
      showOnHomepage: true,
      order: 1
    },
    {
      id: '2',
      value: '14',
      label: {
        en: { text: 'Ongoing Projects' },
        ur: { text: 'جاری منصوبے' }
      },
      suffix: '',
      iconName: 'FaProjectDiagram',
      showOnHomepage: true,
      order: 2
    },
    {
      id: '3',
      value: '195',
      label: {
        en: { text: 'Completed Projects' },
        ur: { text: 'مکمل منصوبے' }
      },
      suffix: '',
      iconName: 'FaCheckCircle',
      showOnHomepage: true,
      order: 3
    },
    {
      id: '4',
      value: '8',
      label: {
        en: { text: 'Total Beneficiaries' },
        ur: { text: 'کل مستفید افراد' }
      },
      suffix: 'Million',
      iconName: 'FaUsers',
      showOnHomepage: true,
      order: 4
    }
  ],
  updatedAt: new Date(),
  createdAt: new Date()
};