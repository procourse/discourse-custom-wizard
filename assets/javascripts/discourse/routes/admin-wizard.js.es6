import CustomWizard from '../models/custom-wizard';
import { ajax } from 'discourse/lib/ajax';

export default Discourse.Route.extend({
  model(params) {
    if (params.wizard_id === 'new') {
      this.set('new', true);
      return CustomWizard.create();
    }
    this.set('new', false);

    const wizard = this.modelFor('admin-wizards-custom').findBy('id', params.wizard_id);
    if (!wizard) return this.transitionTo('adminWizardsCustom.index');

    return wizard;
  },

  afterModel(model) {
    return ajax('/admin/wizards/field-types')
      .then((result) => model.set('fieldTypes', result.types));
  },

  setupController(controller, model) {
    let props = { new: this.get('new'), model };
    const steps = model.get('steps');
    if (steps[0]) props['currentStep'] = steps[0];
    controller.setProperties(props);
  },

  actions: {
    refreshRoute() {
      this.refresh();
    }
  }
});