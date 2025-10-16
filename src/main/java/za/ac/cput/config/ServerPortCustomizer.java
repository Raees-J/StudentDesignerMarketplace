package za.ac.cput.config;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.ServerSocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.stereotype.Component;

/**
 * Ensures that the embedded servlet container starts even when the default port is unavailable.
 */
@Component
public class ServerPortCustomizer implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ServerPortCustomizer.class);
    private static final int DEFAULT_PORT = 8080;
    private static final int MAX_PORT = 65535;

    @Override
    public void customize(ConfigurableServletWebServerFactory factory) {
        Integer configuredPort = factory.getPort();
        int desiredPort = resolveDesiredPort(configuredPort);

        if (desiredPort == 0) {
            return; // 0 means "let the OS choose"
        }

        if (isPortAvailable(desiredPort)) {
            return;
        }

        int fallbackPort = findAvailablePort(desiredPort + 1);
        factory.setPort(fallbackPort);
        LOGGER.warn("Port {} is already in use. Falling back to available port {}.", desiredPort, fallbackPort);
        LOGGER.info("To use a specific port, set the 'server.port' property or SERVER_PORT environment variable.");
    }

    private int resolveDesiredPort(Integer configuredPort) {
        if (configuredPort == null || configuredPort <= 0) {
            return DEFAULT_PORT;
        }
        return configuredPort;
    }

    private boolean isPortAvailable(int port) {
        try (ServerSocket serverSocket = new ServerSocket()) {
            serverSocket.setReuseAddress(false);
            serverSocket.bind(new InetSocketAddress(InetAddress.getByName("0.0.0.0"), port));
            return true;
        } catch (IOException ex) {
            return false;
        }
    }

    private int findAvailablePort(int startingPort) {
        int port = Math.max(startingPort, DEFAULT_PORT);
        while (port <= MAX_PORT) {
            if (isPortAvailable(port)) {
                return port;
            }
            port++;
        }
        throw new IllegalStateException("No available port found between " + startingPort + " and " + MAX_PORT);
    }
}