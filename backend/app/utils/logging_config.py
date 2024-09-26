import logging 
import logging.config
import os

# Get env variables for log file location
LOG_FILE = os.getenv('LOG_FILE', 'app/logs/audiosync.log')

def setup_logging():
    logging_config = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'standard': {
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            },
       },
       'handlers': {
           'console': {
               'class': 'logging.StreamHandler',
               'formatter': 'standard',
               'level': 'DEBUG',
           },
           'file': {
               'class': 'logging.FileHandler',
               'formatter': 'standard',
               'level': 'DEBUG',
               'filename': LOG_FILE,
               'mode': 'a' # Append to log file
           },
       },
       'loggers': {
           '': {    # Root logger
               'handlers': ['console', 'file'],
               'level': 'DEBUG',
               'propagate': True
           },
       }
    }

    logging.config.dictConfig(logging_config)

# Function to get a logger for specific modules
def get_logger(name):
    return logging.getLogger(name)

# Initialize logging when this module is imported
setup_logging()
