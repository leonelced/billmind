#!/bin/bash

start_or_run () {
    docker inspect billmind_rabbitmq > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "Starting BillMind RabbitMQ container..."
        docker start billmind_rabbitmq
    else
        echo "BillMind RabbitMQ container not found, creating a new one..."
        docker run -d --name billmind_rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.2-management
    fi
}

case "$1" in
    start)
        start_or_run
        ;;
    stop)
        echo "Stopping BillMind RabbitMQ container..."
        docker stop billmind_rabbitmq
        ;;
    logs)
        echo "Fetching logs for BillMind RabbitMQ container..."
        docker logs -f billmind_rabbitmq
        ;;
    *)
        echo "Usage: $0 {start|stop|logs}"
        exit 1
esac
