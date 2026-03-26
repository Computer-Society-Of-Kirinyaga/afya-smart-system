# 13 — shadcn/ui Component Usage

## Installation

```bash
npx shadcn@latest init
# Choose: TypeScript, Tailwind, src/ dir, @/ alias
```

## Components to Install

```bash
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add input
npx shadcn@latest add switch
npx shadcn@latest add sheet
npx shadcn@latest add avatar
npx shadcn@latest add progress
npx shadcn@latest add separator
npx shadcn@latest add tooltip
npx shadcn@latest add sonner
npx shadcn@latest add skeleton
```

---

## Per-Page shadcn Usage

---

### Layout Shell

| Component                              | Where                   | How                       |
| -------------------------------------- | ----------------------- | ------------------------- |
| `<Avatar>`                             | Topbar, Sidebar         | Patient initials fallback |
| `<Button variant="ghost" size="icon">` | Topbar bell button      | Icon-only ghost button    |
| `<Separator>`                          | Sidebar nav sections    | Horizontal divider        |
| `<Tooltip>`                            | Sidebar collapsed icons | Label on hover            |

---

### Overview Page

| Component                      | Where                       | How                                           |
| ------------------------------ | --------------------------- | --------------------------------------------- |
| `<Card>`                       | VitalCard, RiskScoreCard    | Card shell — override border/bg with Tailwind |
| `<CardHeader>` `<CardContent>` | All cards                   | Standard card structure                       |
| `<Badge>`                      | StatusBadge, condition tags | Override variant with className               |
| `<Button>`                     | "View all alerts"           | `variant="ghost"` with arrow icon             |
| `<Skeleton>`                   | Loading states              | Match card dimensions                         |

**VitalCard using shadcn Card:**

```tsx
<Card className="group rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-teal-100 hover:shadow-md">
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <div className="flex items-center gap-x-2">
      <div
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg',
          colorClass,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <CardTitle className="text-sm font-medium text-slate-500">
        {label}
      </CardTitle>
    </div>
    <StatusBadge status={status} />
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-semibold tabular-nums text-slate-900">
      {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
    </p>
    <TrendSparkline data={sparklineData} />
  </CardContent>
</Card>
```

---

### Vitals Page

| Component                                                          | Where                             | How                   |
| ------------------------------------------------------------------ | --------------------------------- | --------------------- |
| `<Tabs>` `<TabsList>` `<TabsTrigger>`                              | VitalSelector                     | Switch between vitals |
| `<Card>`                                                           | VitalDetailCard, VitalsChartPanel | Container cards       |
| `<Table>` `<TableHeader>` `<TableBody>` `<TableRow>` `<TableCell>` | VitalsDataTable                   | Hourly readings       |
| `<Badge>`                                                          | StatusBadge in table              | Status cell           |
| `<Skeleton>`                                                       | Loading chart                     | Animated placeholder  |

**Tabs usage:**

```tsx
<Tabs
  defaultValue="heartRate"
  onValueChange={(v) => setSelectedVital(v as VitalType)}
>
  <TabsList className="w-full justify-start border-b border-slate-100 bg-transparent p-0">
    {VITAL_TABS.map((tab) => (
      <TabsTrigger
        key={tab.value}
        value={tab.value}
        className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-500 data-[state=active]:border-teal-600 data-[state=active]:text-teal-600"
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>
```

---

### Alerts Page

| Component                                                     | Where                     | How                        |
| ------------------------------------------------------------- | ------------------------- | -------------------------- |
| `<Table>` ...                                                 | AlertsTable               | Full alert history         |
| `<Select>` `<SelectTrigger>` `<SelectContent>` `<SelectItem>` | AlertsFilterBar           | Severity + vital filters   |
| `<Sheet>` `<SheetTrigger>` `<SheetContent>` `<SheetHeader>`   | AlertDetailSheet          | Side panel detail          |
| `<Button>`                                                    | Mark read, dismiss, clear | Various variants           |
| `<Badge>`                                                     | Severity indicator        | Color-matched per severity |
| `<Skeleton>`                                                  | Loading state             | Table row skeletons        |

**Sheet usage:**

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="sm">
      View details
    </Button>
  </SheetTrigger>
  <SheetContent className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>Alert Details</SheetTitle>
    </SheetHeader>
    <AlertDetailContent alert={selectedAlert} />
  </SheetContent>
</Sheet>
```

**Select usage:**

```tsx
<Select onValueChange={(v) => setFilter(v as AlertSeverity | 'all')}>
  <SelectTrigger className="w-40 border-slate-200">
    <SelectValue placeholder="All severities" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Severities</SelectItem>
    <SelectItem value="critical">Critical</SelectItem>
    <SelectItem value="warning">Warning</SelectItem>
    <SelectItem value="info">Info</SelectItem>
  </SelectContent>
</Select>
```

---

### Analytics Page

| Component    | Where                         | How                         |
| ------------ | ----------------------------- | --------------------------- |
| `<Tabs>`     | WeeklyTrendChart vital switch | Same pattern as Vitals page |
| `<Table>`    | VitalStatsTable               | Avg/min/max per vital       |
| `<Progress>` | PopulationBenchmark           | Patient vs avg bars         |
| `<Select>`   | Date range picker             | 7/14/30 day selector        |
| `<Card>`     | All stat cards                | Standard card pattern       |
| `<Badge>`    | Risk level badge              | Color matched               |

**Progress usage:**

```tsx
<div className="space-y-3">
  {benchmarks.map((b) => (
    <div key={b.vital}>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-600">{b.vital}</span>
        <span className="font-medium text-slate-900">
          {b.percentile}th percentile
        </span>
      </div>
      <Progress
        value={b.percentile}
        className="h-2 bg-slate-100 [&>div]:bg-teal-600"
      />
    </div>
  ))}
</div>
```

---

### Settings Page

| Component     | Where                            | How                    |
| ------------- | -------------------------------- | ---------------------- |
| `<Input>`     | Phone numbers, name, thresholds  | Form inputs            |
| `<Switch>`    | SMS toggles                      | Binary on/off settings |
| `<Button>`    | Save, reset, test SMS            | Primary + ghost        |
| `<Card>`      | Each settings section            | Grouped settings card  |
| `<Badge>`     | Condition tags (patient profile) | Removable pill tags    |
| `<Separator>` | Between settings sections        | Visual divider         |

**Switch usage:**

```tsx
<div className="flex items-center justify-between py-3">
  <div>
    <p className="text-sm font-medium text-slate-900">
      SMS for Critical Alerts
    </p>
    <p className="text-xs text-slate-500">
      Send SMS when a critical threshold is breached
    </p>
  </div>
  <Switch
    checked={smsEnabled.critical}
    onCheckedChange={() => toggleSms('critical')}
    className="data-[state=checked]:bg-teal-600"
  />
</div>
```

---

## Global shadcn Overrides

To match VITALIS theme, add these to your `globals.css` or as className overrides:

```css
/* Override shadcn focus ring to teal */
:root {
  --ring: 180 100% 29%; /* teal-600 in HSL */
  --primary: 180 100% 29%;
  --primary-foreground: 0 0% 100%;
}
```

Or override per-component via `className` (preferred, no CSS file):

```tsx
// Button primary → slate-900 (VITALIS style)
<Button className="bg-slate-900 hover:bg-slate-800 text-white">
```
