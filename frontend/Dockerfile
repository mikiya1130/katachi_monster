FROM node:20-slim

ARG USERNAME=${USERNAME}
ARG USER_UID=${USER_UID}
ARG USER_GID=${USER_GID}

RUN groupadd --gid $USER_GID $USERNAME && \
    useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

USER $USERNAME
WORKDIR /app

COPY /package.json ./

RUN yarn
