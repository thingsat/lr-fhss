# Install, Configure and Run LNS

## Install LNS
```bash
git clone https://github.com/chirpstack/chirpstack-docker.git
cd chirpstack-docker
docker compose pull
docker compose images

docker compose run --rm --entrypoint sh --user root chirpstack -c '\
	apk add --no-cache git && \
	git clone https://github.com/brocaar/lorawan-devices /tmp/lorawan-devices && \
	chirpstack -c /etc/chirpstack import-legacy-lorawan-devices-repository -d /tmp/lorawan-devices'

```

## Config the LR-FHSS configuration
```bash
scp -i ~/.ssh/azure -r ./configuration lns@lns-lrfhss.northeurope.cloudapp.azure.com:~/chirpstack-docker
```

> change `secret` into `configuration/chirpstack/chirpstack.toml`

> change `net_id` into `configuration/chirpstack/chirpstack.toml`

## Run LNS
```bash
docker compose up -d
docker compose ps
docker compose stats
df -h
```

## Configure LNS

Open the LNS console
* http://52.158.12.234:8080
* http://lns-lrfhss.northeurope.cloudapp.azure.com:8080

Default credential is : `admin` `admin`

Change the `admin` password with a generated password (`openssl rand -base64 16`)


## Add a device profile for LR-FHSS endpoint

[decoder.js](decoder.js)

## Register a LR-FHSS gateway

## Register a LR-FHSS application

## Add an InfluxDB integration

## Register a LR-FHSS endpoint



