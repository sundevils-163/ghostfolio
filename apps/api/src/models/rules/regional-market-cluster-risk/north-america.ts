import { Rule } from '@ghostfolio/api/models/rule';
import { ExchangeRateDataService } from '@ghostfolio/api/services/exchange-rate-data/exchange-rate-data.service';
import { I18nService } from '@ghostfolio/api/services/i18n/i18n.service';
import { UserSettings } from '@ghostfolio/common/interfaces';

import { Settings } from './interfaces/rule-settings.interface';

export class RegionalMarketClusterRiskNorthAmerica extends Rule<Settings> {
  private currentValueInBaseCurrency: number;
  private northAmericaValueInBaseCurrency: number;

  public constructor(
    protected exchangeRateDataService: ExchangeRateDataService,
    private i18nService: I18nService,
    languageCode: string,
    currentValueInBaseCurrency: number,
    northAmericaValueInBaseCurrency: number
  ) {
    super(exchangeRateDataService, {
      languageCode,
      key: RegionalMarketClusterRiskNorthAmerica.name
    });

    this.currentValueInBaseCurrency = currentValueInBaseCurrency;
    this.northAmericaValueInBaseCurrency = northAmericaValueInBaseCurrency;
  }

  public evaluate(ruleSettings: Settings) {
    const northAmericaMarketValueRatio = this.currentValueInBaseCurrency
      ? this.northAmericaValueInBaseCurrency / this.currentValueInBaseCurrency
      : 0;

    if (northAmericaMarketValueRatio > ruleSettings.thresholdMax) {
      return {
        evaluation: this.i18nService.getTranslation({
          id: 'rule.regionalMarketClusterRiskNorthAmerica.false.max',
          languageCode: this.getLanguageCode(),
          placeholders: {
            thresholdMax: (ruleSettings.thresholdMax * 100).toPrecision(3),
            valueRatio: (northAmericaMarketValueRatio * 100).toPrecision(3)
          }
        }),
        value: false
      };
    } else if (northAmericaMarketValueRatio < ruleSettings.thresholdMin) {
      return {
        evaluation: this.i18nService.getTranslation({
          id: 'rule.regionalMarketClusterRiskNorthAmerica.false.min',
          languageCode: this.getLanguageCode(),
          placeholders: {
            thresholdMin: (ruleSettings.thresholdMin * 100).toPrecision(3),
            valueRatio: (northAmericaMarketValueRatio * 100).toPrecision(3)
          }
        }),
        value: false
      };
    }

    return {
      evaluation: this.i18nService.getTranslation({
        id: 'rule.regionalMarketClusterRiskNorthAmerica.true',
        languageCode: this.getLanguageCode(),
        placeholders: {
          thresholdMax: (ruleSettings.thresholdMax * 100).toPrecision(3),
          thresholdMin: (ruleSettings.thresholdMin * 100).toPrecision(3),
          valueRatio: (northAmericaMarketValueRatio * 100).toPrecision(3)
        }
      }),
      value: true
    };
  }

  public getCategoryName() {
    return 'Regional Market Cluster Risk'; // TODO: Replace hardcoded text with i18n translation
  }

  public getConfiguration() {
    return {
      threshold: {
        max: 1,
        min: 0,
        step: 0.01,
        unit: '%'
      },
      thresholdMax: true,
      thresholdMin: true
    };
  }

  public getName() {
    return this.i18nService.getTranslation({
      id: 'rule.regionalMarketClusterRiskNorthAmerica',
      languageCode: this.getLanguageCode()
    });
  }

  public getSettings({ baseCurrency, xRayRules }: UserSettings): Settings {
    return {
      baseCurrency,
      isActive: xRayRules?.[this.getKey()]?.isActive ?? true,
      thresholdMax: xRayRules?.[this.getKey()]?.thresholdMax ?? 0.69,
      thresholdMin: xRayRules?.[this.getKey()]?.thresholdMin ?? 0.65
    };
  }
}
