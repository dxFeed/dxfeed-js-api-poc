/** @license
 * Copyright ©2020 Devexperts LLC. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useMemo, useRef } from "react"
import { Inspector } from "react-inspector"

import DXClient from "@dxfeed/widgets-api/client"
import { Box } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormLabel from "@material-ui/core/FormLabel"
import Grid from "@material-ui/core/Grid"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import TextField from "@material-ui/core/TextField"
import { useComponents } from "docz"

import { SUBSCRIPTIONS_MAP } from "./subscriptions"

const SYMBOLS = ["AAPL", "EUR/USD"] as const

enum EventType {
    Candle = "Candle",
    Configuration = "Configuration",
    DailyCandle = "DailyCandle",
    AnalyticOrder = "AnalyticOrder",
    Greeks = "Greeks",
    Message = "Message",
    Order = "Order",
    Profile = "Profile",
    Quote = "Quote",
    Series = "Series",
    SpreadOrder = "SpreadOrder",
    Summary = "Summary",
    TheoPrice = "TheoPrice",
    TimeAndSale = "TimeAndSale",
    Trade = "Trade",
    TradeETH = "TradeETH",
    Underlying = "Underlying",
}

type SubscriptionType = "series" | "timeSeries"

const DataViewer = ({ play, events }: { play: boolean; events: unknown[] }) =>
    (play || events.length > 0) && (
        <Grid style={{ marginTop: 5 }} container spacing={3}>
            {events.length === 0 && <Grid item>Waiting events</Grid>}
            {events.map((event, idx) => (
                <Grid key={idx} item>
                    <Inspector data={event} />
                </Grid>
            ))}
        </Grid>
    )

function Playground() {
    const { playground, pre, h2 } = useComponents()
    const PlaygroundComponent = playground as React.FunctionComponent<{
        scope: Record<string, any>
        language: string
        code: string
    }>
    const PreComponent = pre as React.FunctionComponent<{}>
    const H2Component = h2 as React.FunctionComponent<{}>

    const [type, setType] = React.useState<SubscriptionType>("timeSeries")
    const [urlString, setUrlString] = React.useState("")
    const [endpointUrl, setEndpointUrl] = React.useState("")
    const [eventType, setEventType] = React.useState<EventType>(
        EventType.Candle
    )
    const [symbolName, setSymbolName] = React.useState<string>(SYMBOLS[0])

    const client = React.useRef<DXClient | null>(null)
    const clientUrl = useRef<string | null>(null)

    const swapClient = React.useCallback((url: string) => {
        if (clientUrl.current !== url) {
            if (client.current) {
                client.current.close()
                client.current = null
            }

            if (url !== "") {
                client.current = new DXClient(url)
                clientUrl.current = url
            }
        }
    }, [])

    useEffect(() => () => client.current?.close(), [])

    const VirtualDXClient = useMemo(
        () =>
            class Client {
                constructor(url: string) {
                    swapClient(url)
                }
                connect = () => client.current?.connect()
                close = () => client.current?.close()
                subscribe = async (
                    ...args: Parameters<DXClient["subscribe"]>
                ) =>
                    client.current
                        ? client.current.subscribe(...args)
                        : new Promise(() => null)
            },
        []
    )

    const stringifiedFieldsParam = useMemo(() => {
        if (type === "timeSeries") {
            return ", undefined"
        }

        return ""
    }, [type])

    const dayStart = useMemo(() => {
        const start = new Date()
        start.setHours(0, 0, 0, 0)
        return start.getTime()
    }, [])

    return (
        <>
            <H2Component>Configure</H2Component>

            <Grid container spacing={3}>
                <Grid item lg={4} md={12} xs={12}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select type</FormLabel>
                        <RadioGroup
                            aria-label="type"
                            name="type"
                            value={type}
                            onChange={(event) => {
                                setType(event.target.value as SubscriptionType)
                            }}
                        >
                            <FormControlLabel
                                value="series"
                                control={<Radio />}
                                label="Series"
                            />
                            <FormControlLabel
                                value="timeSeries"
                                control={<Radio />}
                                label="Time Series"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item lg={4} md={6} xs={12}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            Select Event Type
                        </FormLabel>
                        <RadioGroup
                            aria-label="eventType"
                            name="eventType"
                            value={eventType}
                            onChange={(event) => {
                                setEventType(event.target.value as any)
                            }}
                        >
                            {Object.keys(EventType).map((key) => {
                                const value = key as EventType

                                return (
                                    <FormControlLabel
                                        key={value}
                                        value={value}
                                        control={<Radio />}
                                        label={value}
                                    />
                                )
                            })}
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item lg={4} md={6} xs={12}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            Select Symbol Name
                        </FormLabel>
                        <RadioGroup
                            aria-label="symbolName"
                            name="symbolName"
                            value={symbolName}
                            onChange={(event) => {
                                setSymbolName(event.target.value as any)
                            }}
                        >
                            {SYMBOLS.map((value) => (
                                <FormControlLabel
                                    key={value}
                                    value={value}
                                    control={<Radio />}
                                    label={value}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <H2Component>Example</H2Component>
            <PreComponent>
                Example demonstrates how to work with it in <b>React</b>.
                <br />
                <br />
                For debugging you need to look at the console.
            </PreComponent>

            <Box width="100%" marginTop="12px" marginBottom="12px">
                <TextField
                    fullWidth
                    label="You must provide the endpoint URL first:"
                    value={urlString}
                    required
                    onChange={(e) => setUrlString(e.target.value)}
                    InputProps={{
                        endAdornment: endpointUrl !== urlString && (
                            <Button
                                variant="outlined"
                                onClick={() => setEndpointUrl(urlString)}
                            >
                                Connect
                            </Button>
                        ),
                    }}
                />
            </Box>

            {endpointUrl && (
                <PlaygroundComponent
                    scope={{
                        DXClient: VirtualDXClient,
                        Button,
                        DataViewer,
                        ENDPOINT_URL: endpointUrl,
                        ...SUBSCRIPTIONS_MAP,
                    }}
                    language="js"
                    code={`() => {
  const [play, setPlay] = React.useState(false)
  const [events, setEvents] = React.useState([])
  const handleEvents = React.useCallback((events) => {
    setEvents((prevState) => [...prevState, ...events])
  }, [])
    
  const client = React.useMemo(() => new DXClient(ENDPOINT_URL), [])
    
  const unsubscribeRef = React.useRef()
    
  React.useEffect(() => {
    if (play) {
      setEvents([])
      
      const subscription = new ${eventType}Subscription(['${symbolName}']${stringifiedFieldsParam}${
                        type === "timeSeries" ? `, ${dayStart}` : ""
                    })
      void client.subscribe(subscription).then((subscription) =>
        subscription.getStream().subscribe({
          onSubscribe: (sub) => {
            sub.request(Number.MAX_SAFE_INTEGER)
            unsubscribeRef.current = () => sub.cancel()
          },
          onNext: handleEvents,
        })
      )
    } else {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
    return () => unsubscribeRef.current && unsubscribeRef.current()
  }, [play])
    
  return (
    <>
      <Button variant="outlined" onClick={() => setPlay(!play)}>
        {play ? 'Stop' : 'Start'}
      </Button>
      <DataViewer play={play} events={events} />
    </>
  )
}`}
                />
            )}
        </>
    )
}

export default Playground
