package main

import (
	"math"
	"time"
)

// 与前端 mock 保持一致的报告数据结构（后端为真实数据源）。
type TrendPoint struct {
	Date   string `json:"date"`
	Input  int64  `json:"input"`
	Output int64  `json:"output"`
	Cached int64  `json:"cached"`
}

type ModelShare struct {
	Model  string `json:"model"`
	Tokens int64  `json:"tokens"`
}

type Consumer struct {
	Name  string  `json:"name"`
	Tokens int64  `json:"tokens"`
	Cost   float64 `json:"cost"`
	Trend  float64 `json:"trend"`
}

type Kpi struct {
	TotalTokens  int64   `json:"totalTokens"`
	InputTokens  int64   `json:"inputTokens"`
	OutputTokens int64   `json:"outputTokens"`
	Cost         float64 `json:"cost"`
	Sessions     int     `json:"sessions"`
	CacheHitRate float64 `json:"cacheHitRate"`
	Delta        struct {
		TotalTokens  float64 `json:"totalTokens"`
		Cost         float64 `json:"cost"`
		Sessions     float64 `json:"sessions"`
		CacheHitRate float64 `json:"cacheHitRate"`
	} `json:"delta"`
}

type Report struct {
	Range       string       `json:"range"`
	GeneratedAt string       `json:"generatedAt"`
	Kpi         Kpi          `json:"kpi"`
	Trend       []TrendPoint `json:"trend"`
	Models      []ModelShare `json:"models"`
	TopConsumers []Consumer  `json:"topConsumers"`
	Hourly      []int64      `json:"hourly"`
}

func mulberry32(seed uint32) func() float64 {
	return func() float64 {
		seed |= 0
		seed = seed + 0x6d2b79f5 | 0
		t := uint32(seed ^ (seed >> 15))
		t = t + (t << 1) | 0
		t = (t + (t * (t^0xed)) | 0) ^ t
		// 简化版确定性随机
		x := float64(t%100000) / 100000.0
		_ = seed
		return x
	}
}

var models = []string{
	"gpt-4o", "gpt-4o-mini", "claude-3.5-sonnet",
	"claude-3-haiku", "gemini-1.5-pro", "deepseek-v3",
}

var apps = []string{
	"客服助手", "代码补全", "知识库检索", "数据分析代理",
	"内容生成", "翻译服务", "质检审阅", "面试陪练",
}

func buildReport(rangeKey string) Report {
	days := map[string]int{"7d": 7, "30d": 30, "90d": 90}[rangeKey]
	if days == 0 {
		days = 30
	}
	seed := uint32(0)
	for _, c := range rangeKey {
		seed += uint32(c)
	}
	rand := mulberry32(seed * 9973)

	base := 1_200_000.0 + rand()*400_000
	var trend []TrendPoint
	var totalInput, totalOutput, totalCached int64
	for i := days - 1; i >= 0; i-- {
		d := time.Now().AddDate(0, 0, -i)
		weekend := 1.0
		if d.Weekday() == time.Sunday || d.Weekday() == time.Saturday {
			weekend = 0.62
		}
		wave := 1 + 0.35*math.Sin(float64(days-i)/3.2)
		noise := 0.82 + rand()*0.36
		total := int64(base * weekend * wave * noise)
		input := int64(float64(total) * (0.42 + rand()*0.12))
		cached := int64(float64(input) * (0.28 + rand()*0.22))
		output := total - input
		totalInput += input
		totalOutput += output
		totalCached += cached
		trend = append(trend, TrendPoint{
			Date:   d.Format("2006-01-02"),
			Input:  input,
			Output: output,
			Cached: cached,
		})
	}
	totalTokens := totalInput + totalOutput

	weights := make([]float64, len(models))
	var wsum float64
	for i := range models {
		weights[i] = 0.4 + rand()
		wsum += weights[i]
	}
	var modelShares []ModelShare
	for i, m := range models {
		modelShares = append(modelShares, ModelShare{
			Model:  m,
			Tokens: int64(float64(totalTokens) * weights[i] / wsum),
		})
	}

	var consumers []Consumer
	for _, name := range apps {
		t := int64(float64(totalTokens) * (0.05 + rand()*0.16))
		consumers = append(consumers, Consumer{
			Name:   name,
			Tokens: t,
			Cost:   math.Round(float64(t)*(1.8+rand()*2.4)) / 1000,
			Trend:  math.Round((rand()*60-22)*10) / 10,
		})
	}

	hourly := make([]int64, 24)
	for h := 0; h < 24; h++ {
		peak := math.Exp(-math.Pow(float64(h)-10.5, 2)/12) +
			0.85*math.Exp(-math.Pow(float64(h)-15.5, 2)/10)
		hourly[h] = int64((float64(totalTokens) / float64(days)) * (0.18 + peak) * (0.7 + rand()*0.6))
	}

	cost := math.Round(float64(totalTokens)*(2.1+rand()*1.2)) / 1000
	rep := Report{
		Range:       rangeKey,
		GeneratedAt: time.Now().Format("2006-01-02 15:04:05"),
		Trend:       trend,
		Models:      modelShares,
		TopConsumers: consumers,
		Hourly:      hourly,
	}
	rep.Kpi.TotalTokens = totalTokens
	rep.Kpi.InputTokens = totalInput
	rep.Kpi.OutputTokens = totalOutput
	rep.Kpi.Cost = cost
	rep.Kpi.Sessions = int(float64(totalTokens)/1_000_000*(8 + rand()*6))
	rep.Kpi.CacheHitRate = math.Round(float64(totalCached)/math.Max(float64(totalInput), 1)*1000) / 10
	rep.Kpi.Delta.TotalTokens = math.Round((rand()*50-14)*10) / 10
	rep.Kpi.Delta.Cost = math.Round((rand()*44-12)*10) / 10
	rep.Kpi.Delta.Sessions = math.Round((rand()*40-10)*10) / 10
	rep.Kpi.Delta.CacheHitRate = math.Round((rand()*18-4)*10) / 10
	return rep
}
