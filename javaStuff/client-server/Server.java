import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {
    
    private Socket socket = null;
    private ServerSocket serverSocket = null;
    private DataInputStream inputStream = null;

    public Server(int port) {
        try {
            serverSocket = new ServerSocket(port);
            System.out.println("server listening on port " + port + " ...");

            socket = serverSocket.accept();
            System.out.println("client accepted");

            inputStream = new DataInputStream(new BufferedInputStream(socket.getInputStream()));

            String line = "";

            while (!line.equals("over")) {
                try {
                    line = inputStream.readUTF();
                    System.out.println(line);
                } catch (IOException e) {
                    System.out.println(e);
                }

                System.out.println("closing connection");

                socket.close();
                inputStream.close();
            }
        } catch (IOException e) {
            System.out.println(e);
        }
    }
    
    public static void main(String args[]) {
        Server s = new Server(4321);
    }
}