const cabloyAdminContentDefaults = {
  VIcon: {
    size: 18,
  },
  VMenu: {
    VIcon: {
      size: 18,
    },
    VList: {
      density: 'compact',
    },
  },
  VList: {
    density: 'compact',
  },
  VTabs: {
    density: 'default',
  },
  VTab: {
    density: 'default',
  },
  VAlert: {
    density: 'compact',
  },
  VChip: {
    density: 'default',
  },
  VBtn: {
    density: 'compact',
  },
  VBtnGroup: {
    density: 'compact',
  },
  VTextField: {
    density: 'compact',
  },
  VTextarea: {
    density: 'compact',
  },
  VSelect: {
    density: 'compact',
  },
  VAutocomplete: {
    density: 'compact',
  },
  VCombobox: {
    density: 'compact',
  },
  VDataTable: {
    density: 'compact',
  },
  VDataTableServer: {
    density: 'compact',
  },
};

export const cabloyAdminDefaults = {
  ...cabloyAdminContentDefaults,
  VDialog: cabloyAdminContentDefaults,
};
