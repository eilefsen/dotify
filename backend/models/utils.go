package models

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetPathInt(c *gin.Context, name string) (uint32, error) {
	val := c.Params.ByName(name)
	if val == "" {
		return 0, fmt.Errorf("%q path parameter value is empty or not specified", name)
	}
	number, err := strconv.ParseUint(val, 10, 32)
	if err != nil {
		return 0, fmt.Errorf("GetPathInt %q: %v", name, err)
	}
	return uint32(number), nil

}
