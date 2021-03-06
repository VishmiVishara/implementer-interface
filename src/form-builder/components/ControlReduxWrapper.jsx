import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { focusControl, selectControl } from 'form-builder/actions/control';
import { blurControl, deselectControl, eventsChanged } from 'form-builder/actions/control';
import { Draggable } from 'bahmni-form-controls';
import { ComponentStore } from 'bahmni-form-controls';
import { Exception } from 'form-builder/helpers/Exception';
import { formBuilderConstants } from 'form-builder/constants';
import { addSourceMap, setChangedProperty,
  sourceChangedProperty, generateTranslations } from 'form-builder/actions/control';
import { getConceptFromMetadata } from 'form-builder/helpers/componentMapper';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import DeleteControlModal from 'form-builder/components/DeleteControlModal.jsx';
import ScriptEditorModal from './ScriptEditorModal';

class ControlWrapper extends Draggable {
  constructor(props) {
    super(props);
    this.control = ComponentStore.getDesignerComponent(props.metadata.type).control;
    this.props = props;
    this.metadata = Object.assign({}, props.metadata);
    this.onSelected = this.onSelected.bind(this);
    this.childControl = undefined;
    this.state = { active: false, showDeleteModal: false };
    this.storeChildRef = this.storeChildRef.bind(this);
    this.getJsonDefinition = this.getJsonDefinition.bind(this);
    this.processDragStart = this.processDragStart.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.clearSelectedControl = this.clearSelectedControl.bind(this);
    this.clearControlProperties = this.clearControlProperties.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
  }

  onSelected(event, metadata) {
    this.props.dispatch(selectControl(metadata));
    event.stopPropagation();
  }

  clearSelectedControl(event) {
    this.props.dispatch(deselectControl());
    this.props.dispatch(blurControl());
    event.stopPropagation();
  }

  componentWillReceiveProps(nextProps) {
    const activeControl = (this.metadata.id === nextProps.focusedControl);
    this.setState({ active: activeControl });
  }

  conditionallyAddConcept(newProps) {
    const concept = get(newProps.conceptToControlMap, this.metadata.id);
    if (concept && !this.metadata.concept && this.control.injectConceptToMetadata) {
      const newMetadata = this.control.injectConceptToMetadata(
        this.metadata,
        concept,
        this.props.idGenerator
      );
      this.metadata = newMetadata;
      this.props.dispatch(selectControl(this.metadata));
    }
  }

  updateProperties(newProps) {
    const controlProperty = newProps.controlProperty;
    if (controlProperty && this.metadata.id === controlProperty.id) {
      const childMetadata = this.childControl.getJsonDefinition();
      const childProperties = childMetadata.properties;
      const updatedProperties = Object.assign({}, childProperties, controlProperty.property);
      if (!isEqual(this.metadata.properties, updatedProperties)) {
        this.metadata = Object.assign({}, this.metadata, { properties: updatedProperties });
        this.props.dispatch(selectControl(this.metadata));
      }
    }
  }

  componentDidMount() {
    if (this.props.metadata && this.props.metadata.id && this.props.metadata.concept) {
      this.props.dispatch(addSourceMap(getConceptFromMetadata(this.props.metadata)));
    }
  }

  componentWillUpdate(newProps) {
    this.conditionallyAddConcept(newProps);
    this.updateProperties(newProps);
    if (this.metadata.id !== newProps.metadata.id) {
      this.metadata = Object.assign({}, this.metadata, newProps.metadata);
      this.control = ComponentStore.getDesignerComponent(this.metadata.type).control;
    }
  }

  getJsonDefinition(isBeingMoved) {
    if (this.childControl) {
      const jsonDefinition = this.childControl.getJsonDefinition();
      if (jsonDefinition === undefined && !isBeingMoved) {
        const conceptMissingMessage = formBuilderConstants.exceptionMessages.conceptMissing;
        throw new Exception(conceptMissingMessage);
      }
      this.props.dispatch(generateTranslations(jsonDefinition));
      return jsonDefinition;
    }
    return undefined;
  }

  processDragStart() {
    const metadata = this.getJsonDefinition(true);
    return metadata || this.props.metadata;
  }

  storeChildRef(ref) {
    if (ref) {
      this.childControl = ref;
    }
  }

  onFocus(event) {
    this.props.dispatch(focusControl(this.metadata.id));
    event.stopPropagation();
  }

  clearControlProperties() {
    this.props.dispatch(deselectControl());
  }

  confirmDelete() {
    this.setState({ showDeleteModal: true });
  }

  closeDeleteModal() {
    this.setState({ showDeleteModal: false });
  }

  showDeleteControlModal() {
    if (this.state.showDeleteModal) {
      return (
        <DeleteControlModal
          closeModal={() => this.closeDeleteModal()}
          controlName={this.props.metadata.name}
          deleteControl={this.props.deleteControl}
        />
      );
    }
    return null;
  }

  updateScript(script, id) {
    if (id) {
      this.props.dispatch(selectControl(this.metadata));
      this.props.dispatch(sourceChangedProperty(script));
    } else {
      this.props.dispatch(eventsChanged(script));
    }
    this.closeScriptEditorDialog(id);
  }

  closeScriptEditorDialog(id) {
    if (id) {
      this.props.dispatch(setChangedProperty({ controlEvent: false }, id));
    } else {
      this.props.dispatch(setChangedProperty({ formEvent: false }));
    }
  }

  getScript(id) {
    const selectedControl = this.props.selectedControl;
    if (id && selectedControl) {
      return selectedControl.events && selectedControl.events.onValueChange;
    }
    const formDetails = this.props.formDetails;
    return formDetails.events && formDetails.events.onFormInit;
  }

  showScriptEditorDialog() {
    const properties = this.props.controlProperty;
    if (properties && properties.property &&
      (properties.id === this.metadata.id && properties.property.controlEvent ||
      !properties.id && properties.property.formEvent)) {
      return (
        <ScriptEditorModal
          close={() => this.closeScriptEditorDialog(properties.id)}
          script={this.getScript(properties.id)}
          updateScript={(script) => this.updateScript(script, properties.id)}
        />
      );
    }
    return null;
  }

  render() {
    const onDragEndFunc = this.onDragEnd(this.metadata);
    return (
      <div
        className={
          classNames('control-wrapper', { 'control-selected': this.state.active }, 'clearfix')
        }
        draggable="true"
        onDragEnd={ (e) => onDragEndFunc(e) }
        onDragStart={ this.onDragStart(this.metadata) }
        onFocus={(e) => this.onFocus(e)}
        tabIndex="1"
      >
        <this.control
          clearSelectedControl={ this.clearSelectedControl}
          deleteControl={ this.confirmDelete }
          dispatch={this.clearControlProperties}
          idGenerator={ this.props.idGenerator}
          metadata={ this.metadata }
          onSelect={ this.onSelected }
          ref={ this.storeChildRef }
          setError={this.props.setError}
          showDeleteButton={ this.props.showDeleteButton && this.state.active }
          wrapper={ this.props.wrapper }
        />
        { this.showDeleteControlModal() }
        { this.showScriptEditorDialog() }
      </div>
    );
  }
}

ControlWrapper.propTypes = {
  controlProperty: PropTypes.shape({
    id: PropTypes.string,
    property: PropTypes.object,
  }),
  deleteControl: PropTypes.func,
  formDetails: PropTypes.shape({
    events: PropTypes.object,
  }),
  metadata: PropTypes.object,
  setError: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  wrapper: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    conceptToControlMap: state.conceptToControlMap,
    controlProperty: state.controlProperty,
    formDetails: state.formDetails,
    focusedControl: state.controlDetails.focusedControl,
    selectedControl: state.controlDetails.selectedControl,
  };
}

export default connect(mapStateToProps, null, null, { withRef: true })(ControlWrapper);
