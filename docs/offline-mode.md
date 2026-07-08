# Offline Mode

Open Sync listens to browser online and offline events. While offline, mutations continue to write locally and queue operations. When connectivity returns, the queue is processed automatically unless `autoSync` is disabled.
