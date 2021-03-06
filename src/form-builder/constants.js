export const formBuilderConstants = {
  conceptUrl: '/openmrs/ws/rest/v1/concept',
  conceptRepresentation: 'custom:(uuid,set,display,allowDecimal,name:(uuid,name),' +
  'conceptClass:(uuid,name),datatype:(uuid,name),answers,handler,hiNormal,lowNormal,' +
  'hiAbsolute,lowAbsolute,units,setMembers:(uuid,set,display,allowDecimal,name:(uuid,name),' +
  'conceptClass:(uuid,name),datatype:(uuid,name),' +
  'answers,hiNormal,lowNormal,hiAbsolute,lowAbsolute,units))',
  exceptionMessages: {
    conceptMissing: 'Please associate Concept to Obs',
  },
  // eslint-disable-next-line
  bahmniFormResourceUrl: '/openmrs/ws/rest/v1/bahmniie/form/save',
  formResourceDataType: 'org.bahmni.customdatatype.datatype.FileSystemStorageDatatype',
  formUrl: '/openmrs/ws/rest/v1/form',
  formTranslationUrl: '/openmrs/ws/rest/v1/bahmniie/form/translate',
  supportedObsDataTypes: 'Boolean,Text,Numeric,Coded,Date,DateTime,Complex',
  supportedObsGroupDataTypes: 'N/A',
  defaultLocaleUrl: '/openmrs/ws/rest/v1/bahmnicore/sql/globalproperty?property=default_locale',
  saveTranslationsUrl: '/openmrs/ws/rest/v1/bahmniie/form/saveTranslation',
  allowedLocalesUrl: '/bahmni_config/openmrs/apps/home/locale_languages.json',
  translationsUrl: '/openmrs/ws/rest/v1/bahmniie/form/translations',
};
