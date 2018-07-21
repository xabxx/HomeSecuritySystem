# This is a sample Dockerfile you can modify to deploy your own app based on face_recognition

FROM python:3.6-slim-stretch

RUN apt-get -y update
RUN apt-get install -y --fix-missing \
    build-essential \
    cmake \
    gfortran \
    git \
    wget \
    curl \
    graphicsmagick \
    libgraphicsmagick1-dev \
    libatlas-dev \
    libavcodec-dev \
    libavformat-dev \
    libgtk2.0-dev \
    libjpeg-dev \
    liblapack-dev \
    libswscale-dev \
    pkg-config \
    python3-dev \
    python3-numpy \
    software-properties-common \
    zip \
    && apt-get clean && rm -rf /tmp/* /var/tmp/*

# Must define the following env. variables
ENV known_bucket_name=#TODO
ENV unknown_bucket_name=#TODO
ENV known_file=#TODO
ENV unknown_file=#TODO
ENV functionURL=#TODO
ENV GOOGLE_APPLICATION_CREDENTIALS=#TODO
ENV topic_name = #TODO 'projects/{project}/topics/{topic}'
ENV sub_name = #TODO 'projects/{project}/subscriptions/{subscription}'

RUN cd ~ && \
    mkdir -p dlib && \
    git clone -b 'v19.9' --single-branch https://github.com/davisking/dlib.git dlib/ && \
    cd  dlib/ && \
#    python3 setup.py install --yes USE_AVX_INSTRUCTIONS

COPY . /root/compare_face.py
RUN cd /root/compare_face.py && \
    pip3 install -r requirements.txt
RUN python3 /root/compare_face.py
