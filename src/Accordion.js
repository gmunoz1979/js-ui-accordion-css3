Accordion = Class(
  {
    HH: 30,

    renderTo: null,
    width: 'auto',
    height: 'auto',
    cls: '',
    autoRender: false,
    panels: [],
    hp: 0,
    isFix: false,

    initialize: function(config) {
      apply(this, config);

      if (!this.renderTo) throw new Error('renderTo is undefined!');
      if (typeof this.renderTo === 'string') throw new Error('renderTo is not a Element');

      this.autoRender && this.render();
    },

    configAction: function(header, panel, container, div) {
      var self = this;

      header.onclick = function() {
        var collapse = panel.classList.contains('expanded');

        if (collapse) {
          /**
           * Colapsar panel
           */
          container.style.height  = 0;
          container.style.opacity = 0;
          panel.classList.remove('expanded');
        } else {
          /**
           * Expandir panel
           */
          container.style.height  = self.hp + 'px';
          container.style.opacity = 1.0;
          panel.classList.add('expanded');
        }

        if (self.isFix) return;

        var panels   = div.querySelectorAll('.panel-accordion').length;
        var expanded = div.querySelectorAll('.expanded');

        var i = 0;
        var j = expanded.length;

        var lc = panels - j;
        var nh = self.hp + ((self.hp/j) * lc);

        for (; i<j; i++) {
          expanded[i].querySelector('.panel-container').style.height = nh + 'px';
        }
      }
    },

    render: function() {
      /**
       * Definimos las dimensiones del accordion
       * según configuración.
       */
      var width  = this.width  !== 'auto' ? this.width  : this.renderTo.clientWidth;
      var height = this.height !== 'auto' ? this.height : this.renderTo.clientHeight;

      /**
       * Creamos el contenedor del Accordion
       */
      var div = document.createElement('div');
      div.className = 'panel accordion ' + this.cls;
      div.style.width  = width  + 'px';
      div.style.height = height + 'px';

      this.renderTo.appendChild(div);

      /**
       * Vamos añadiendo los paneles
       */
      var sep;
      var sepCount = 0;
      var len = this.panels.length;

      var children   = this.children = {};
      var containers = [];

      var self = this;

      this.panels.forEach(
        function(p, i) {
          var panel = document.createElement('div');
          panel.className = 'panel panel-accordion expanded panel-' + p.name;
          panel.setAttribute('data-pos', i);

          var header = document.createElement('div');
          header.className = 'header';

          var icon1 = document.createElement('div');
          icon1.className = 'icon-header';

          header.appendChild(icon1);

          var icon2 = document.createElement('div');
          icon2.className = 'icon-accordion';

          header.appendChild(icon2);

          var title = document.createElement('span');
          title.innerHTML = p.title;

          header.appendChild(title);
          panel.appendChild(header);

          sep = document.createElement('hr');
          sep.className = 'separator-horizontal';

          panel.appendChild(sep);
          sepCount++;

          var container = document.createElement('div');
          container.className = 'panel-container';

          panel.appendChild(container);
          containers.push(container);

          sep = sep.cloneNode();
          panel.appendChild(sep);
          sepCount++;

          div.appendChild(panel);
          children[p.name] = panel;

          self.configAction(header, panel, container, div);
        }
      );

      /**
       * Se eliminael último separador
       */
      sep.remove();
      sepCount--;

      /**
       * Calculamos el alto de los paneles
       */
      var hp = this.hp = (height - (this.HH * len) - (2 * sepCount)) / len;
      containers.forEach(
        function(c) {
          c.style.height = hp + 'px';
        }
      );
    }
  }
);