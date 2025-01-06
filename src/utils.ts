export const rules = {
    notEmpty: (val: any) => !!val || 'Pole nesmí být prazdné',
    atLeastOne: (val: any) => val > 0 || 'Pole musí být číslo větší než 0'
}