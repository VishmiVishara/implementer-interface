import { expect } from 'chai';
import * as control from 'form-builder/actions/control';

describe('control', () => {
  describe('selectControl', () => {
    it('should return the selected control metadata', () => {
      const metadata = {
        type: 'obsControl',
        concept: {
          uuid: 'someUuid',
          datatype: 'text',
        },
      };
      const action = control.selectControl(metadata);
      expect(action.type).to.be.eql('SELECT_CONTROL');
      expect(action.metadata).to.be.eql(metadata);
    });
  });

  describe('selectSource', () => {
    it('should return the selected control id', () => {
      const concept = {
        name: 'Pulse',
        uuid: 'someUuid',
      };
      const action = control.selectSource(concept, 1);
      expect(action.type).to.be.eql('SELECT_SOURCE');
      expect(action.id).to.be.eql(1);
      expect(action.concept).to.be.eql(concept);
    });
  });

  describe('deselectControl', () => {
    it('should return appropriate type', () => {
      const action = control.deselectControl();
      expect(action).to.be.eql({ type: 'DESELECT_CONTROL' });
    });
  });

  describe('removeSourceMap', () => {
    it('should return appropriate type', () => {
      const action = control.removeSourceMap();
      expect(action).to.be.eql({ type: 'REMOVE_SOURCE_MAP' });
    });
  });

  describe('addSourceMap', () => {
    it('should return the source map', () => {
      const sourceMap = { 1: { name: 'someName', uuid: 'someUuid' } };
      const action = control.addSourceMap(sourceMap);
      expect(action.type).to.be.eql('ADD_SOURCE_MAP');
      expect(action.sourceMap).to.be.eql(sourceMap);
    });
  });

  describe('setChangedProperty', () => {
    it('should return the property', () => {
      const property = { mandatory: true };
      const action = control.setChangedProperty(property, '123');
      expect(action.type).to.be.eql('SET_CHANGED_PROPERTY');
      expect(action.property).to.be.eql(property);
      expect(action.id).to.be.eql('123');
    });
  });


  describe('removeControlProperties', () => {
    it('should return the appropriate action', () => {
      const action = control.removeControlProperties();
      expect(action.type).to.be.eql('REMOVE_CONTROL_PROPERTIES');
    });
  });

  describe('focusControl', () => {
    it('should return the focus action and control id', () => {
      const action = control.focusControl(10);
      expect(action.type).to.be.eql('FOCUS_CONTROL');
      expect(action.id).to.be.eql(10);
    });
  });

  describe('blurControl', () => {
    it('should return the blur action', () => {
      const action = control.blurControl();
      expect(action.type).to.be.eql('BLUR_CONTROL');
    });
  });

  describe('sourceChangedProperty', () => {
    it('should return the action and changed source', () => {
      const source = 'any thing';
      const action = control.sourceChangedProperty(source);

      expect(action.type).to.eql('SOURCE_CHANGED');
      expect(action.source).to.eql(source);
    });
  });

  describe('eventsChanged', () => {
    it('should return the action and changed events', () => {
      const events = 'any thing';
      const action = control.eventsChanged(events);

      expect(action.type).to.eql('EVENT_CHANGED');
      expect(action.events).to.eql(events);
    });
  });

  describe('setDefaultLocale', () => {
    it('should set the default locale', () => {
      const defaultLocale = 'en';
      const action = control.setDefaultLocale(defaultLocale);

      expect(action.type).to.eql('SET_DEFAULT_LOCALE');
      expect(action.locale).to.eql(defaultLocale);
    });
  });

  describe('updateTranslations', () => {
    it('should update translations', () => {
      const data = {
        value: 'Test Value',
        type: 'Labels',
        TranslationsKey: 'TEST',
      };
      const action = control.updateTranslations(data);

      expect(action.type).to.eql('UPDATE_TRANSLATIONS');
      expect(action.control).to.eql(data);
    });
  });

  describe('removeLocaleTranslation', () => {
    it('should remove translations for given locale', () => {
      const locale = 'es';
      const action = control.removeLocaleTranslation(locale);

      expect(action.type).to.eql('REMOVE_LOCALE_TRANSLATIONS');
      expect(action.locale).to.eql(locale);
    });
  });
});
