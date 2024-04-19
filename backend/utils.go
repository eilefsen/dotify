package main

import (
	"fmt"
	"io"
	"log/slog"
	"strconv"

	"github.com/tcolgate/mp3"
)

func EstimateMP3Duration(data io.Reader) (uint32, error) {
	t := 0.0

	d := mp3.NewDecoder(data)
	var f mp3.Frame
	skipped := 0

	for {
		if err := d.Decode(&f, &skipped); err != nil {
			if err == io.EOF {
				break
			}
			slog.Error("EstimateMp3Duration", "err", err)
			return uint32(t), err
		}

		t = t + f.Duration().Seconds()
	}
	return uint32(t), nil
}

func parseFrame() {}

func ParseUint32(s string) (uint32, error) {
	n, err := strconv.ParseUint(s, 10, 32)
	if err != nil {
		return 0, fmt.Errorf("ParseUint32 %q: %v", n, err)
	}
	return uint32(n), nil
}
