module.exports = (vendor) => {
  switch (vendor) {
    case 'Glatz':
      return 'richard@aelsolutions.com'
      break;
    case 'Amazonas':
    case 'Alba Krapf':
      return 'office@laminvale.co.uk'
      break;
    default:
      return 'sales@europaleisure.co.uk'
  }

}
