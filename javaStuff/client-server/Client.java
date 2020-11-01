import java.io.DataOutputStream;
import java.io.IOException;
import java.io.DataInputStream;
import java.net.Socket;
import java.net.UnknownHostException;

public class Client {
    private Socket socket = null;
    private DataInputStream inputStream = null;
    private DataOutputStream outputStream = null;

    public Client(final String ipAddress, final int port) {
        try {
            socket = new Socket(ipAddress, port);

            System.out.println("connected");

            inputStream = new DataInputStream(System.in);
            outputStream = new DataOutputStream(socket.getOutputStream());

        } catch (final UnknownHostException e) {
            System.out.println(e);
        } catch (final IOException e) {
            System.out.println(e);
        }

        String line = "";

        while (!line.equals("over")) {
            try {
                line = inputStream.readUTF();
                outputStream.writeUTF(line);
            } catch (final IOException e) {
                System.out.println(e);
            }
        }

        try {
            inputStream.close();
            outputStream.close();
            socket.close();
        } catch (IOException e) {
            System.out.println(e);
        }
    }
    
    public static void main(String args[]) {
        Client c = new Client("127.0.0.1", 4321);
    }
}