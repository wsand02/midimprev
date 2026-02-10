FROM rust:1.93 AS rust-builder

# clone and install midirave
WORKDIR /usr/src/
RUN git clone https://github.com/wsand02/midirave
WORKDIR /usr/src/midirave
RUN cargo install --path .

# clone and install nami3
WORKDIR /usr/src/
RUN git clone https://github.com/wsand02/nami3
WORKDIR /usr/src/nami3
RUN cargo install --path .

FROM oven/bun:1 AS oven-builder
WORKDIR /usr/src/app
COPY . .
RUN bun install --frozen-lockfile --production
RUN bun build ./src/index.ts --compile --outfile midimprev

FROM debian:trixie-slim AS runner
# nami3 requires GLIBC
RUN apt-get update && apt-get install -y libc6 && rm -rf /var/lib/apt/lists/*
COPY --from=oven-builder /usr/src/app/midimprev /usr/local/bin/midimprev
COPY --from=rust-builder /usr/local/cargo/bin/midirave /usr/local/bin/midirave
COPY --from=rust-builder /usr/local/cargo/bin/nami3 /usr/local/bin/nami3

# run the app
ENTRYPOINT [ "midimprev" ]
