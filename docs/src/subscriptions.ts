import { AnalyticOrderSubscription } from '@dxfeed/widgets-api/records/AnalyticOrder'
import { CandleSubscription } from '@dxfeed/widgets-api/records/Candle'
import { ConfigurationSubscription } from '@dxfeed/widgets-api/records/Configuration'
import { DailyCandleSubscription } from '@dxfeed/widgets-api/records/DailyCandle'
import { GreeksSubscription } from '@dxfeed/widgets-api/records/Greeks'
import { MessageSubscription } from '@dxfeed/widgets-api/records/Message'
import { OrderSubscription } from '@dxfeed/widgets-api/records/Order'
import { ProfileSubscription } from '@dxfeed/widgets-api/records/Profile'
import { QuoteSubscription } from '@dxfeed/widgets-api/records/Quote'
import { SeriesSubscription } from '@dxfeed/widgets-api/records/Series'
import { SpreadOrderSubscription } from '@dxfeed/widgets-api/records/SpreadOrder'
import { SummarySubscription } from '@dxfeed/widgets-api/records/Summary'
import { TheoPriceSubscription } from '@dxfeed/widgets-api/records/TheoPrice'
import { TimeAndSaleSubscription } from '@dxfeed/widgets-api/records/TimeAndSale'
import { TradeSubscription } from '@dxfeed/widgets-api/records/Trade'
import { TradeETHSubscription } from '@dxfeed/widgets-api/records/TradeETH'
import { UnderlyingSubscription } from '@dxfeed/widgets-api/records/Underlying'

export const SUBSCRIPTIONS_MAP = {
  CandleSubscription,
  ConfigurationSubscription,
  DailyCandleSubscription,
  AnalyticOrderSubscription,
  GreeksSubscription,
  MessageSubscription,
  OrderSubscription,
  ProfileSubscription,
  QuoteSubscription,
  SeriesSubscription,
  SpreadOrderSubscription,
  SummarySubscription,
  TheoPriceSubscription,
  TimeAndSaleSubscription,
  TradeSubscription,
  TradeETHSubscription,
  UnderlyingSubscription,
}
