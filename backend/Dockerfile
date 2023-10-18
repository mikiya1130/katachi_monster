FROM python:3.11-slim

ARG USERNAME=${USERNAME}
ARG USER_UID=${USER_UID}
ARG USER_GID=${USER_GID}

RUN groupadd -o --gid $USER_GID $USERNAME && \
    useradd -o --uid $USER_UID --gid $USER_GID -m $USERNAME

COPY ./requirements.txt /tmp/
RUN pip install -U pip && \
    pip --disable-pip-version-check --no-cache-dir install -r /tmp/requirements.txt

USER $USERNAME
WORKDIR /app
