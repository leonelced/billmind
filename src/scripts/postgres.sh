#!/bin/bash

create_db () {
    docker exec billmind_postgres psql -U postgres -c "CREATE DATABASE billmind;" 2>/dev/null || true
    # '2>/dev/null' silences the error if the database already exists (redirects only stderr (error output) to nowhere)
    # '|| true' prevents the script from failing if the command returns an error
}

start_or_run () {
    source "$(dirname "$0")/../../.env"
    docker inspect billmind_postgres > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "Starting BillMind Postgres container..."
        docker start billmind_postgres
        sleep 3
        create_db
    else
        echo "BillMind Postgres container not found, creating a new one..."
        docker run -d --name billmind_postgres -p 5432:5432 -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e TZ=America/Los_Angeles postgres:17
        sleep 3
        create_db        
    fi
}

case "$1" in
    start)
        start_or_run
        # verify if the database was created:
        # docker exec -it billmind_postgres psql -U postgres -c "\l"
        ;;
    stop)
        echo "Stopping BillMind Postgres container..."
        docker stop billmind_postgres
        ;;
    logs)
        echo "Fetching logs for BillMind Postgres container..."
        docker logs -f billmind_postgres
        ;;
    *)
        echo "Usage: $0 {start|stop|logs}"
        exit 1
esac
