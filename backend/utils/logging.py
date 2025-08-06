import logging
import os
from datetime import datetime

# Create a ".logs" folder if it doesn't exist
log_dir = ".logs"
os.makedirs(log_dir, exist_ok=True)

def setup_logger(name: str = __name__) -> logging.Logger:
    # Generate a timestamped log filename
    log_filename = datetime.now().strftime("in_out_%Y-%m-%d_%H-%M-%S.log")
    log_path = os.path.join(log_dir, log_filename)

    # Configure logging
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Prevent adding handlers multiple times if imported repeatedly
    if not logger.handlers:
        # file_handler = logging.FileHandler(log_path, encoding="utf-8")
        console_handler = logging.StreamHandler()

        formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
        # file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        # logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger
