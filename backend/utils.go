package main

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"strconv"
	"time"

	"github.com/tcolgate/mp3"
	"gopkg.in/vansante/go-ffprobe.v2"
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

func mp3Duration(data io.Reader) (uint32, error) {
	ctx, cancelFn := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelFn()

	d, err := ffprobe.ProbeReader(ctx, data)
	if err != nil {
		slog.Error("EstimateMp3Duration", "err", err)
		return 0, err
	}
	return uint32(d.Format.DurationSeconds), nil
}

func parseFrame() {}

func ParseUint32(s string) (uint32, error) {
	n, err := strconv.ParseUint(s, 10, 32)
	if err != nil {
		return 0, fmt.Errorf("ParseUint32 %q: %v", n, err)
	}
	return uint32(n), nil
}
