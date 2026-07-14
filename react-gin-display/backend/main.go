package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// 允许前端 dev server (5173) 跨域访问
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type"},
	}))

	api := r.Group("/api")
	{
		// 当前仅返回 mock 数据；接入真实数据源时替换 buildReport 即可。
		api.GET("/report", func(c *gin.Context) {
			rangeKey := c.DefaultQuery("range", "30d")
			c.JSON(http.StatusOK, buildReport(rangeKey))
		})
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.Run(":8080")
}
