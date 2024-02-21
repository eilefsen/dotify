package main

import (
	"fmt"
	"strconv"
)

func ParseUint32(s string) (uint32, error) {
	n, err := strconv.ParseUint(s, 10, 32)
	if err != nil {
		return 0, fmt.Errorf("ParseUint32 %q: %v", n, err)
	}
	return uint32(n), nil
}
