import moment from 'moment'
const dateUtility = {
  formats: {
    timestamp: 'YYYY-MM-DD hh:mm:ss.SSSSSS',
    output: 'MM/DD/YYYY',
    dateAndTime: 'MM/DD/YYYY hh:mm:ss a',
    dateIso: 'YYYY-MM-DD',
    dateTelemetry: 'YYYY-MM-DDTHH:mm:ssZ',
    sortableDataAndTime: 'YYYY-MM-DD HH:mm:ss'
  },
  formatOutput (datetime) {
    return datetime !== null ? moment.utc(datetime).local().format(this.formats.output) : null
  },
  formatDateAndTime (datetime) {
    return datetime !== null ? moment.utc(datetime).local().format(this.formats.dateAndTime) : null
  },
  formatDateIso (datetime) {
    return datetime !== null ? moment.utc(datetime).local().format(this.formats.dateIso) : null
  },
  formatDateTimeIso (datetime) {
    return datetime !== null ? moment.utc(datetime).local().format(this.formats.timestamp) : null
  },
  formatTsFromNowTelemetry (ts) {
    return ts !== null ? moment.utc(ts, this.formats.dateTelemetry).local().fromNow() : null
  },
  formatTsDateTimeTelemetry (ts) {
    return ts !== null ? moment.utc(ts, this.formats.dateTelemetry).local().format(this.formats.sortableDataAndTime) : null
  }
}

export default dateUtility
