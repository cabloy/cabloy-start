import {
  computed,
  createCommentVNode,
  createVNode,
  normalizeClass,
  normalizeStyle,
  onServerPrefetch,
  shallowRef,
} from 'vue';
import { useTheme } from 'vuetify';
import { VIcon } from 'vuetify/components';
import { useTextColor } from 'vuetify/lib/composables/color.js';
import { useDefaults } from 'vuetify/lib/composables/defaults.js';
import { useIcon } from 'vuetify/lib/composables/icons.js';
import { useSize } from 'vuetify/lib/composables/size.js';
import { convertToUnit, flattenFragments, useRender } from 'vuetify/lib/util/index.js';
import { BeanBase, isHttpUrl, useApp } from 'zova';
import { Sys } from 'zova-module-a-bean';
import { $getZovaIcon } from 'zova-module-a-icon';

import { VSvgIconZova } from '../lib/svg.js';

@Sys()
export class SysIcon extends BeanBase {
  public async initialize() {
    this._patchSetup();
  }

  private _patchSetup() {
    const self = this;
    VIcon.setup = function (props, { attrs, slots }) {
      const propsWithDefaults = useDefaults(props);
      onServerPrefetch(async () => {
        let [iconName] = self._parseNameFromSlotDefault(slots);
        iconName = iconName || propsWithDefaults.icon;
        if (!iconName || isHttpUrl(iconName)) {
          return;
        }
        const app = useApp();
        const $$toolIcon = await app.bean._getBean('a-icon.tool.icon', true);
        await $$toolIcon.parseIconInfo(iconName);
      });

      const slotIcon = shallowRef();
      const { themeClasses } = useTheme();
      const { sizeClasses } = useSize(propsWithDefaults);
      const { textColorClasses, textColorStyles } = useTextColor(() => propsWithDefaults.color);
      const iconDefault = useIcon(() => slotIcon.value || propsWithDefaults.icon);
      const iconV = computed(() => {
        return self._getIconData(slotIcon.value || propsWithDefaults.icon) ?? iconDefault;
      });
      useRender(() => {
        if (!slotIcon.value && !propsWithDefaults.icon) return createCommentVNode();
        const { iconData } = iconV.value;
        const slotValue = slots.default?.();
        if (slotValue) {
          slotIcon.value = flattenFragments(slotValue).filter(
            node => node.type === Text && node.children && typeof node.children === 'string',
          )[0]?.children;
        }
        const hasClick = !!(attrs.onClick || attrs.onClickOnce);
        return createVNode(
          iconData.value.component,
          {
            'tag': propsWithDefaults.tag,
            'icon': iconData.value.icon,
            'class': normalizeClass([
              'v-icon',
              'notranslate',
              themeClasses.value,
              sizeClasses.value,
              textColorClasses.value,
              {
                'v-icon--clickable': hasClick,
                'v-icon--disabled': propsWithDefaults.disabled,
                'v-icon--start': propsWithDefaults.start,
                'v-icon--end': propsWithDefaults.end,
              },
              propsWithDefaults.class,
            ]),
            'style': normalizeStyle([
              {
                '--v-icon-opacity': propsWithDefaults.opacity,
              },
              !sizeClasses.value
                ? {
                    fontSize: convertToUnit(propsWithDefaults.size),
                    height: convertToUnit(propsWithDefaults.size),
                    width: convertToUnit(propsWithDefaults.size),
                  }
                : undefined,
              textColorStyles.value,
              propsWithDefaults.style,
            ]),
            'role': hasClick ? 'button' : undefined,
            'aria-hidden': !hasClick,
            'tabindex': hasClick ? (propsWithDefaults.disabled ? -1 : 0) : undefined,
          },
          {
            default: () => [slotValue],
          },
        );
      });
      return {};
    };
  }

  private _getIconData(iconName) {
    if (isHttpUrl(iconName)) {
      return {
        iconData: {
          value: {
            component: VSvgIconZova,
            icon: iconName,
          },
        },
      };
    }
    const iconInfo = $getZovaIcon(iconName);
    if (!iconInfo) return;
    return {
      iconData: {
        value: {
          component: VSvgIconZova,
          icon: `#${iconInfo.symbolId}`,
        },
      },
    };
  }

  private _parseNameFromSlotDefault(slots) {
    if (!slots.default) return [undefined, null];
    const slotDefault = slots.default();
    if (!slotDefault) return [undefined, null];
    const icons = flattenFragments(slotDefault).filter(
      node => node.type === Text && node.children && typeof node.children === 'string',
    );
    const iconName = icons[0]?.children as string;
    return [iconName, slotDefault];
  }
}
